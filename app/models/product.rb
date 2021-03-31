class Product < ApplicationRecord
  belongs_to :seller
  # serialize :category, Array

 def self.available
  select('p.id AS product_id, p.price, p.description, p.category, s.id AS seller_id, s.name, s.email')
  .from('products as p')
  .joins("INNER JOIN sellers AS s ON s.id = p.seller_id")
  .order('s.name')
 end
#  select p.id AS product_id, p.price, p.description, p.category
#  from products as p
#      order by  p.category

def self.categories_index(category)
  select('p.id AS product_id, p.price, p.description, p.category')
  .from('products as p')
  .where("p.category like ?", "%" + category + "%")
end



# select p.id AS product_id, p.price, p.description, p.category
# from products as p
#      where p.category like '%';

end